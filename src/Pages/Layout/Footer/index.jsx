import React from 'react'
import styles from './Footer.module.scss'
import {RiInstagramLine} from 'react-icons/ri'
import {BsLinkedin, BsGithub} from 'react-icons/bs'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className={styles.footer}>
        
        <hr/>

        <div className={styles.footer__sociais}>
            <a href="https://www.instagram.com/t.crepequer/" target='_blank' rel='noreferrer'><RiInstagramLine  size={25} color='white'/></a>
            <a href="https://www.linkedin.com/in/thiago-crepequer/" target='_blank' rel='noreferrer'><BsLinkedin size={25} color='white'/></a>
            <a href="https://github.com/ThiagoCrepequer" target='_blank' rel='noreferrer'><BsGithub size={25} color='white' /></a>
        </div>
        
        <div className={styles.footer__paginas}>
            <p><Link to="/contato">Contato</Link></p>
            <p><Link to="/about">Sobre mim</Link></p>
            <p><Link to="/projetos">Projetos</Link></p>
        </div>

        <p>&copy;2023 Thiago Crepequer</p>
    </footer>
  )
}
