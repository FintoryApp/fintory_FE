// export type RootStackParamList = {
//   First: undefined;
//     NoReport: undefined;
//     ReportMain: undefined;
//     EconomyStudy: undefined;
//     EconomyWordScreen: undefined;
//     EconomyWordDetailScreen: { word: string };
//     EconomyNewsDetailScreen: {id:number};
//     Report: undefined;
//     DetailReport: { selectedYear: number; selectedMonth: number;report:any };
//     StockMain: undefined;
//     Stock: undefined;
//     Login: undefined;
//     Main: undefined;
//     Home: undefined;
//     Profile: undefined;
//     FindPassword: undefined;
//     ChangePassword: undefined;
//     FindId: undefined;
//     SignIn: undefined;
//     MyPage: undefined;
//     VirtualAccount: undefined;
//     Point: undefined;
//     StockChart: {code: string; period: string;};
//     BuyStock: undefined;
//     SellStock: undefined;
//     WantPrice: undefined;
//   };

export type RootStackParamList = {
  First: undefined;
  Login: undefined;
  SignIn: undefined;
  Main: undefined;
  FindPassword: undefined;
  ChangePassword: undefined;
  FindId: undefined;
  Study: undefined;
  BuyStock: {stockCode: string; stockName: string; closePrice: number;};
  WantPrice: undefined;
  SellStock: undefined;
  SettingMain: undefined;
  StockChart: {stockCode: string; stockName: string; closePrice: number;};

};

export type ReportStackParamList = {
  ReportMain: undefined;
  DetailReport: { selectedYear: number; selectedMonth: number; report:any };
  NoReport: undefined;
};

export type StockStackParamList = {
  StockMain: undefined;
  
};

export type HomeStackParamList = {
  Home: undefined;
  Report: undefined;
};

export type EconomyStudyStackParamList = {
  EconomyStudy: undefined;
  EconomyWordScreen: undefined;
  WordDetailScreen: { id: number };
  EconomyNewsDetailScreen: {id:number};
};

export type ProfileStackParamList = {
  Profile: undefined;
  MyPage: undefined;
  VirtualAccount: undefined;
  Point: undefined;
};

