import PrintableBlock from '../../components/PrintableBlock';
import PrivacyData from '../../content/CookiePolicy.json';

const PrivacyPolicy = () => {
    return (<PrintableBlock data={PrivacyData}/>);
}

export default PrivacyPolicy;