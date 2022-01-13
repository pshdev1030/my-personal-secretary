import { AppProps } from 'next/app';
import { NextPage } from 'next';
import axios from 'axios';
import { wrapper } from '../store';
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import '../components/style.scss';
axios.defaults.baseURL = 'http://localhost:6000';

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default wrapper.withRedux(MyApp);
