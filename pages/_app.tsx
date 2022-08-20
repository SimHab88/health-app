import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "../hooks/auth";

const variants = {
  pageInitial: {
    opacity: 0,
  },
  pageAnimate: {
    opacity: 1,
  },
  // exit: { transition: { staggerChildren: 0.1 } },
};

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <AuthProvider>
      <AnimatePresence>
        <Layout>
          <motion.div
            key={router.route}
            initial="pageInitial"
            animate="pageAnimate"
            exit="exit"
            variants={variants}
          >
            <Component {...pageProps} key={router.route} />
          </motion.div>
        </Layout>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default MyApp;
