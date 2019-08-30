import IExternalUrl from "./IExternalUrl";

export default interface IContext {
    type: string;
    href: string;
    external_ids: IExternalUrl;
    uri: string;
}