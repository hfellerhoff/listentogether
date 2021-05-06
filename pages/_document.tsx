import Document, { Html, Head, Main, NextScript } from 'next/document';

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
                defer
                src='https://scripts.simpleanalyticscdn.com/latest.js'
              ></script>
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
