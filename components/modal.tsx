import styles from "../app/styles/Modal.module.scss";
import Image, {StaticImageData} from "next/image";
import {useState} from "react";

export default function MessageAlert(props: {image: StaticImageData; title: string; message: string; nextAction(): void}) {
  const [showAlert, setShowAlert] = useState(true);

  const handleClick = () => {
    setShowAlert(false);
    props.nextAction();
  };
  if (showAlert) {
    return (
      <>
        <section className={styles.modal_wrapper}>
          <div className={styles.modal_container}>
            <div>
              <Image src={props.image} height={50} width={50} alt="success icon"></Image>
            </div>
            <div>
              <h1>{props.title}</h1>
            </div>
            <div>
              <p>{props.message}</p>
            </div>
            <div className={styles.close_button}>
              <button onClick={() => handleClick()}>Close</button>
            </div>
          </div>
        </section>
      </>
    );
  } else {
    return null;
  }
}
