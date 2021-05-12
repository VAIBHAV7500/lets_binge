
const SvgIcon = ({ src, width, height,center}) => {
  const styles = {
    height: height,
    width: width,
  }
  if(center){
    styles.position = 'absoulte';
    styles.right = '50%';
    styles.top = '50%';
    styles.transform = 'translate(50%,50%)';
  }
  return (<img src={`/img/svg/${src}`} alt={src} with={width} height={height} style={styles} />);
}

export default SvgIcon;
