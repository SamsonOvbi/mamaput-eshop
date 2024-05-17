export type Sort = 'desc' | 'asc' | 'lowest' | 'highest' | 'toprated';
// export type Sort = 'desc' | 'asc' ;
export type Order = 'lowest' | 'highest' | 'toprated' | 'a-z' | 'z-a';

/** The height of product box */
export const ROW_HEIGHT: { [id: number]: number } = { 1: 300, 2: 300, 4: 340 };