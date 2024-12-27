import { Modal } from "antd";

export const ErrorModal = (message: string): void => {
  Modal.error({
    title: message,
  });
};
