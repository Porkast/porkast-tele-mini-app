
export type SubscriptionDataDto = {
    Id: string;
    UserId: string;
    CreateTime: Date;
    Status: number;
    Keyword: string;
    OrderByDate: number;
    Lang: string;
    Country: string;
    ExcludeFeedId: string;
    Source: string;
    RefId: string;
    RefName: string;
    Type: string;
    Count: number;
    UpdateTime?: Date | null;
    TotalCount?: number;
}