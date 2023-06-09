import { Answer, Question } from ".";

export type StatsProps = {
    questions: Question[];
    answers: Answer[];
    isFetching: boolean;
};
