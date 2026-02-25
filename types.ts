
export enum SchoolType {
  ELEMENTARY = '國小',
  JUNIOR_HIGH = '國中',
  SENIOR_HIGH = '高中'
}

export interface SchoolData {
  序號: number;
  學校名稱: string;
  縣市: string;
  類型: string;
  建築物總樓地板面積?: number;
  教職員總人數: number;
  學生總人數: number;
  學校人數: number;
  碳排放總量: number;
  人均碳排放當量: number;
  "固定式排放源_總量": number;
  "固定式排放源比例(%)": number;
  "固定式排放源_人均": number;
  "移動式排放源_總量": number;
  "移動式排放源比例(%)": number;
  "移動式排放源_人均": number;
  "逸散性排放源_總量": number;
  "逸散性排放源比例(%)": number;
  "逸散性排放源_人均": number;
  "能源間接排放源_總量": number;
  "能源間接排放源比例(%)": number;
  "能源間接排放源_人均": number;
  "其他間接排放源_總量": number;
  "其他間接排放源比例(%)": number;
  "其他間接排放源_人均": number;
  "負碳排作為_再生能源": number;
  "負碳排作為_樹木碳匯": number;
  "負碳排作為_減碳策略": number;
}
