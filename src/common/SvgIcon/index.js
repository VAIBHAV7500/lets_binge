
const SvgIcon = ({ src, width, height}) => {
  const styles = {
    height: height,
    width: width,

  }
  return (<img src={`/img/svg/${src}`} alt={src} with={width} height={height} style={styles} />);
}

export default SvgIcon;
