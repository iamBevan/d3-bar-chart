import Head from "next/head"
import { Chart } from "../components/chart/chart"
import styles from "../styles/pages/home.module.scss"

export default function Home(): JSX.Element {
	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<h1>App</h1>
			<Chart />
			<footer className={styles.footer}>
				<a
					href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
					target='_blank'
					rel='noopener noreferrer'
				>
					Powered by{" "}
					<img
						src='/vercel.svg'
						alt='Vercel Logo'
						className={styles.logo}
					/>
				</a>
			</footer>
		</div>
	)
}
