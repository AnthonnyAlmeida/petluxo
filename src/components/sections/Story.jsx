/* PetLuxo — Story */

import sobreImg from '../../../assets/sobre_nos/sobre_nos.webp';
import { STORY } from '../../data/siteContent.js';
import styles from './Story.module.css';

export function Story() {
  return (
    <section className={styles.story} id="sobre">
      <div className={['wrap', styles.storyGrid].filter(Boolean).join(' ')}>
        <div className="reveal">
          <div className={styles.storyArt}>
            <img
              src={sobreImg}
              alt="Sobre a PetLuxo"
              style={{width:"100%", height:"100%", objectFit:"cover", display:"block"}}
            />
          </div>
        </div>

        <div className={styles.storyText}>
          <div className="section-tag reveal">
            <span className="num">03</span><span className="line"></span><span>{STORY.tag}</span>
          </div>
          <p className={[styles.manifesto, 'reveal'].filter(Boolean).join(' ')}>
            {STORY.manifesto}
          </p>
          <h2 className="serif reveal d1">
            {STORY.titleStart}<br/><i className="italic gold-text">{STORY.titleAccent}</i><br/>{STORY.titleEnd}
          </h2>
          <p className={[styles.lead, 'reveal', 'd2'].filter(Boolean).join(' ')}>
            {STORY.lead}
          </p>
          {STORY.paragraphs.map((text) => (
            <p key={text} className="reveal d3">{text}</p>
          ))}
          <p className={[styles.assinatura, 'reveal', 'd4'].filter(Boolean).join(' ')}>
            {STORY.signature}
          </p>
        </div>
      </div>
    </section>
  );
}
