import { Review } from "models";



export interface CreateReviewDto extends Pick<Review, 'rating' | 'content'> {}