export interface ICadrartTypedRequestBody<T> extends Express.Request {
  body: T;
}
