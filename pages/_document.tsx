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
            <script
              async
              defer
              data-website-id='bdf79312-c4cd-4783-abb0-d71bbcf4c596'
              src='https://umami.henryfellerhoff.com/umami.js'
            ></script>
          ) : (
            <></>
          )}
        </Head>
        <body>
          {/* TODO: Fix issue with web playback not being defined */}
          <script src='https://sdk.scdn.co/spotify-player.js'></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
