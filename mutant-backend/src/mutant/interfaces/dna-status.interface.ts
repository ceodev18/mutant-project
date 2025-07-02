export const MUTANT = 'mutant';
export const HUMAN = 'human';
export const EXISTS_MUTANT = 'exists_mutant';
export const EXISTS_HUMAN = 'exists_human';

export type DnaStatus =
    | typeof MUTANT
    | typeof HUMAN
    | typeof EXISTS_MUTANT
    | typeof EXISTS_HUMAN;
