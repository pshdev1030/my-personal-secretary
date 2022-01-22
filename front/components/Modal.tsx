import styled from "@emotion/styled";
import { Button } from "antd";
import { ReactElement, ReactNode, useCallback } from "react";

interface ModalPropsTypes {
  children: ReactNode;
  visible: boolean;
  title: string;
  footer?: ReactNode[];
  onCloseModal?: () => void;
  onSubmit?: (data?: any) => void;
}

const Modal = ({
  children,
  visible,
  title,
  footer,
  onCloseModal,
}: ModalPropsTypes): ReactElement => {
  const onClickContent = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);
  return (
    <>
      {visible ? (
        <>
          <BackGround />
          <ModalWrapper>
            <ModalHeader>
              {title}
              <Button onClick={onCloseModal}>×</Button>
            </ModalHeader>
            <ModalContent onClick={onClickContent}>{children}</ModalContent>
            <ModalFooter onClick={onClickContent}>
              {footer?.map((ele: any) => (
                <span key={ele.key}>{ele}</span>
              ))}
            </ModalFooter>
          </ModalWrapper>
        </>
      ) : null}
    </>
  );
};

export default Modal;

const BackGround = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
`;

const ModalWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
`;

const ModalHeader = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(0, 0, 0, 0.85);
  background: #fff;
  & > button {
    all: unset;
    font-size: 1.5em;
    padding: 0.3em;
  }
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px 20px;
  min-width: 25vw;
  @media screen and (max-width: 500px) {
    width: 100vw;
  }
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
`;

const ModalFooter = styled.div`
  padding: 10px 16px;
  text-align: right;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 2px 2px;
`;
