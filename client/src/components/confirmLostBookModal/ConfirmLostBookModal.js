import React from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmLostBookModal({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Báo mất sách</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      Bạn có chắc chắn muốn báo cáo cuốn sách này là bị thất lạc không?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmLostBookModal;
