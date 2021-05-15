import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import Slide from "react-reveal/Slide";

import SvgIcon from "../../../../common/SvgIcon";
import Button from "../../../../common/Button";

import * as S from "./styles";

const RightBlock = ({ title, sub, content, button, icon, t, id, createRoom}) => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleClick = (item) => {
    if(item.id === 'create_room'){
      createRoom();
    }else{
      scrollTo("about");
    }
  }

  return (
    <S.RightBlockContainer>
      <Row type="flex" justify="space-between" align="middle" id={id}>
        <Col lg={11} md={11} sm={11} xs={24}>
          <Slide left>
            <S.ContentWrapper>
              <h6>{t(title)}</h6>
              <S.Content>{t(content)}</S.Content>
              <S.ButtonWrapper>
                {button &&
                  typeof button === "object" &&
                  button.map((item, id) => {
                    return (
                      <>
                        <Button
                          key={id}
                          color={item.color}
                          width={true}
                          onClick={() => handleClick(item)}
                        >
                        {t(item.title)}
                        </Button><br/>
                      </>
                    );
                  })}
              </S.ButtonWrapper>
            </S.ContentWrapper>
            <div style={{
            display: 'block',
            paddingTop: '10px'
            }}>
              {sub}
            </div>
          </Slide>
        </Col>
        <Col lg={11} md={11} sm={12} xs={24}>
          <Slide right>
            <SvgIcon
              src={icon}
              className="about-block-image"
              width="100%"
              height="100%"
            />
          </Slide>
        </Col>
      </Row>
    </S.RightBlockContainer>
  );
};

export default withTranslation()(RightBlock);
