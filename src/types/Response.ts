export type JsonResponse = {
    code: number; // ((0: Success, 1: Error, >1: Error Code))
    message: string;
    data: any;
}