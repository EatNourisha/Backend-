import { WithdrawalRequest } from "models";


export interface WithdrawalRequestDto extends Pick<WithdrawalRequest, 'amount' | 'account_info'> {}