export interface NotifyDto {
  tag: string;
  ticker: string;
  title: string;
  content: string;
  tokens?: string[];

  // options for broadcasting
  customer_ids?: string[];
  roles?: string[];
  metadata?: {
    [key: string]: any;
  };
}
