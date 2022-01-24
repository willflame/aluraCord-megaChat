import appConfig from '../config.json';
function GlobalStyle() {
    return (
        <style global jsx>{`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
            }

            body {
                font-family: 'Open Sans', sans-serif;
            }

            /* App fit Height */
            html, body, #_next {
                min-height: 100vh;
                display: flex;
                flex: 1;
            }

            #_next {
                flex: 1;
            }

            #_next > * {
                flex: 1;
            }
            /* ./App fit Height */
        `}</style>
    );
}

function Title(props) {
    const Tag = props.tag;
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
                ${Tag} {
                    color: ${appConfig.theme.colors.neutrals['000']};
                    font-size: 24px;
                    font-weight: 600; 
                }
            `}</style>
        </>
    );
}

function HomePage() {
  return (
    <div>
        <GlobalStyle />
        <Title tag="h2">Boas vindas de volta!</Title>
        Welcome to Next.js!
    </div>
  );
}

export default HomePage;
