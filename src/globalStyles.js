import { createGlobalStyle } from 'styled-components';

const Styles = createGlobalStyle`

    body,
    html,
    a {
        font-family: 'Ubuntu', sans-serif;
    }


    body {
        margin:0;
        padding:0;
        border: 0;
        outline: 0;
        overflow-x: hidden;
        background-color: #111111;
        color: white;
    }

    a:hover {
        color: #000;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: 'Ubuntu', sans-serif;
        background: linear-gradient(145deg,#f81f01,#ee076e);
        font-size: 35px;
        text-transform: uppercase;
        font-family: Montserrat,sans-serif;
        font-weight: 900;
        
        
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        ::selection {
            color: white;
            -webkit-text-fill-color: white;
        }
      
        @media only screen and (max-width: 414px) {
          font-size: 1.625rem;
        }
    }

    p {
        color: white;
        font-size: 1.125rem;
    }

    h1 {
        font-weight: 600;
    }

    a {
        text-decoration: none;
        outline: none;
        color: #2E186A;

        :hover {
            color: #2e186a;
        }
    }
    
    *:focus {
        outline: none;
    }

    .about-block-image svg {
        text-align: center;
    }

    .ant-drawer-body {
        display: flex;
        flex-direction: column;
        padding: 1.25rem;
        text-align: left;
        padding-top: 2.5rem;
        padding-right: 2rem;
    }

    .anticon,
    .ant-notification-notice-icon-success {
        color: rgb(255,130,92);
    }

    .ant-drawer-wrapper-body{
        background-color: #111111;
    }

    ::-moz-selection { /* Code for Firefox */
    color: white;
    background: #ee076e;
    }

    ::selection {
    color: white;
    background: #ee076e;
    }
`;

export default Styles;
