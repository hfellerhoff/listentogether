import Document, { Html, Head, Main, NextScript } from 'next/document';

const GA_TRACKING_ID = 'G-KFGRJP029S';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {process.env.VERCEL_ENV === 'production' ? (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              ></script>
              <script
                async
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', '${GA_TRACKING_ID}');`,
                }}
              />
            </>
          ) : (
            <></>
          )}
        </Head>
        <body>
          {/* TODO: Fix issue with web playback not being defined */}
          {/* <script src='https://sdk.scdn.co/spotify-player.js'></script> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
