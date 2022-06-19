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
              data-website-id='fb58a977-885c-4dc9-a5d8-425e4de59f84'
              src='https://umami.henryfellerhoff.com/umami.js'
            ></script>
          ) : (
            <></>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
