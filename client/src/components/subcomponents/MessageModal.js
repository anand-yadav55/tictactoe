export default function MessageModal(props) {
  const msgBox = document.getElementsByClassName('msg')[0];

  return <h3>{props.msg}</h3>;
}
