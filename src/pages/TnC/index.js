import PrintableBlock from '../../components/PrintableBlock';
import TnCJson from '../../content/TnC.json';

const TnC = () => {
    return (<PrintableBlock data={TnCJson}/>);
}

export default TnC;