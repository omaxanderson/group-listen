import axios from 'axios';
import IPaging from "../interfaces/spotify/IPagingObject";
import get from 'lodash/get';

export interface ISpotifyOpts {
   client_id: string;
   client_secret: string;
}

export interface IAuthorizeOpts extends ISpotifyOpts {
   redirect_uri: string;
   scopes?: string[];
}

export interface ILoginParams extends ISpotifyOpts {
   code: string;
   redirect_uri: string;
}

export interface ISearchOpts {
   query: string;
   type: string;
   market?: string;
   limit?: number;
   offset?: number;
   include_external?: 'audio';
}

export default class SpotifyApi {
   public client_id: string;
   public client_secret: string;
   public endpoint: string = 'https://api.spotify.com/v1';

   public authorize = async (req, res, opts: IAuthorizeOpts): Promise<void> => {
      const {
         scopes,
         redirect_uri,
         client_id,
      } = opts;
      const url = 'https://accounts.spotify.com/authorize'
         + '?response_type=code'
         + `&client_id=${client_id}`
         + (scopes ? `&scope=${encodeURIComponent(scopes.join(' '))}` : '')
         + `&redirect_uri=${redirect_uri}`.replace(/\s/g, '');
      res.redirect(url.replace(/\s/g, ''));
   };

   public login = async (req, res, opts: ILoginParams): Promise<{
      access_token: string;
      refresh_token: string;
   } | false> => {
      const {
         code,
         redirect_uri,
         client_id,
         client_secret,
      } = opts;

      const data = {
         grant_type: 'authorization_code',
         code,
         redirect_uri,
         client_id,
         client_secret,
      };

      try {
         const result = await axios({
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
            transformRequest: [
               // just puts the object into a url-encoded format
               data => Object.keys(data).map(key => `${key}=${data[key]}`).join('&'),
            ],
         });

         const {
            access_token,
            refresh_token,
            expires_in,
            scope,
         } = result.data;
         console.log('accesstoken', access_token);
         console.log('refreshtoken', refresh_token);

         req.session.access_token = access_token;
         req.session.refresh_token = refresh_token;
         console.log('setting access token');

         return {
            access_token,
            refresh_token,
         };
      } catch (e) {
         console.log('error: ', e);
         return false;
      }
   };

   public proxy = async (req, res) => {
      const path: string = req.params['*'];
      const { query } = req;
      const { method } = req.raw;
      const { access_token: sess_access_token } = req.session;
      const access_token = sess_access_token || get(req, 'headers.authorization', '').split(' ')[1];
      if (!access_token) {
         throw new Error('Access token required!');
      }
      const url = `${this.endpoint}/${path}`
         + `?${Object.entries(query).map(([key, val]) => `${key}=${val}`).join('&')}`;
      try {
         const result = await this.makeRequest(url, { access_token }, method);
         if (!result || ![200, 204].includes(result.status)) {
            return {
               success: false,
               message: 'idk',
            };
         }
         return result.data || {
            success: true,
            status: result.status,
         };
      } catch (e) {
         return {
            success: false,
            from: 'proxy',
            message: e.message,
         };
      }
   }

   /**
    *
    * @param url
    * @param opts
    * @param method
    */
   private makeRequest = async (
       url: string,
       opts: { body?: Object; query?: Object, access_token: string },
       method: string = 'get'
   ) => {
      const { body, query, access_token } = opts;
     if (!access_token) {
        throw new Error('Access token missing');
     }
      const funcs = {
         get: axios.get,
         post: axios.post,
         put: axios.put,
      };
      const func = funcs[method.toLowerCase()];

      const queryParams = query && Object.entries(query)
        .map(([key, val]) => `${key}=${val}`)
        .join('&');
      console.log('queryParams', queryParams);

      const args: Array<string | Object> = [
         `${url}${ !url.includes('?') ? '?' : ''}${queryParams || ''}&access_token=${opts.access_token}`,
      ];
      console.log('args', JSON.stringify(args));

      if (opts.body) {
         args.push(opts.body);
      }

      try {
         const result = await func(...args);
         return result;
      } catch (e) {
         const message = get(e, 'response.data.error.message', 'An unexpected error occurred');
         throw new Error(message);
      }
   }
}
