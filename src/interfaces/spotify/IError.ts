export default interface IError {
   status: number;
   message: string;
};

export interface IPlayerError extends IError{
   reason: string;
}
