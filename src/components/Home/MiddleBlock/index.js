import { lazy } from "react";
import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import Fade from "react-reveal/Fade";

import * as S from "./styles";

const Button = lazy(() => import("../../../common/Button"));

const MiddleBlock = ({ title, content, button, t, id, createRoom }) => {
  return (
    <S.MiddleBlock>
      <Row type="flex" justify="center" align="middle" id={id}>
        <Fade bottom>
          <S.ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <h6>{t(title)}</h6>
              <S.Content>{t(content)}</S.Content>
              {button ? (
                <Button
                  name="submit"
                  type="submit"
                  onClick={createRoom}
                >
                  {t(button)}
                </Button>
              ) : (
                ""
              )}
            </Col>
          </S.ContentWrapper>
        </Fade>
      </Row>
    </S.MiddleBlock>
  );
};

export default withTranslation()(MiddleBlock);
