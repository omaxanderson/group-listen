import axios from 'axios';

export interface ISpotifyOpts {
   client_id: string;
   client_secret: string;
}

export interface IAuthorizeOpts {
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

   public constructor(opts: ISpotifyOpts) {
      this.client_id = opts.client_id;
      this.client_secret = opts.client_secret;
   }

   public authorize = async (req, res, opts: IAuthorizeOpts): Promise<void> => {
      const { scopes, redirect_uri } = opts;
      const url = 'https://accounts.spotify.com/authorize'
         + '?response_type=code'
         + `&client_id=${this.client_id}`
         + (scopes ? `&scope=${encodeURIComponent(scopes.join(' '))}` : '')
         + `&redirect_uri=${redirect_uri}`.replace(/\s/g, '');
      res.redirect(url.replace(/\s/g, ''));
   }

   public login = async (req, res, opts: ILoginParams): Promise<{
      access_token: string;
      refresh_token: string;
   } | false> => {
      const { code, redirect_uri, client_id, client_secret } = opts;

      const data = {
         grant_type: 'authorization_code',
         code,
         redirect_uri,
         client_id,
         client_secret,
      }

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
         console.log(e);
         return false;
      }
   }

   public search = async (opts: ISearchOpts) => {

   }
}
