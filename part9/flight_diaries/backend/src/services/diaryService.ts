import diaries from '../../data/entries';
import { DiaryEntry } from '../types';

const getEntries = (): DiaryEntry[] => diaries;
const addDiary = () => null;

export default { getEntries, addDiary };