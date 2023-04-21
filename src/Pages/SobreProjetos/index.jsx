import React from 'react'
import styles from './SobreProjetos.module.scss'
import { motion } from "framer-motion";

export default function SobreProjetos() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={styles.sobreprojetos}>
            <h1>ASDASD</h1>
        </motion.div>
    )
}
