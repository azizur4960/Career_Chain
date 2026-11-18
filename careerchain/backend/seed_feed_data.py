# -*- coding: utf-8 -*-
import datetime
import logging
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.feed import FeedPost, FeedComment, FeedReaction

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("feed_seeder")

def seed_feed():
    db: Session = SessionLocal()
    try:
        logger.info("Clearing existing feed data...")
        db.query(FeedReaction).delete()
        db.query(FeedComment).delete()
        db.query(FeedPost).delete()
        db.commit()

        # Fetch users
        users = {u.email: u for u in db.query(User).all()}
        admin = users.get("admin@diu.edu.bd")
        farhan = users.get("farhan.masud@diu.edu.bd") or users.get("alumni@diu.edu.bd")
        tanvir = users.get("tanvir.ahmed@diu.edu.bd") or users.get("student@diu.edu.bd")
        sadia = users.get("sadia.islam@diu.edu.bd")
        rakibul = users.get("rakibul.hasan@diu.edu.bd")
        mehedi = users.get("mehedi.zaman@diu.edu.bd")
        nusrat = users.get("nusrat.jahan@diu.edu.bd")
        arifur = users.get("arifur.rahman@diu.edu.bd")
        sumaiya = users.get("sumaiya.akter@diu.edu.bd")
        ashikur = users.get("ashikur.chowdhury@diu.edu.bd")
        tahmina = users.get("tahmina.tabassum@diu.edu.bd")
        mahmud = users.get("mahmud.hassan@diu.edu.bd")
        anika = users.get("anika.tabassum@diu.edu.bd")
        hasan = users.get("hasan.tariq@diu.edu.bd")
        tamim = users.get("tamim.iqbal@diu.edu.bd")
        fariha = users.get("fariha.zaman@diu.edu.bd")
        kamrul = users.get("kamrul.hasan@diu.edu.bd")
        shirin = users.get("shirin.sultana@diu.edu.bd")
        zubair = users.get("zubair.alam@diu.edu.bd")
        nafis = users.get("nafis.fuad@diu.edu.bd")
        sabrina = users.get("sabrina.chowdhury@diu.edu.bd")

        now = datetime.datetime.utcnow()

        logger.info("Creating rich Community Feed posts...")

        posts = []

        # Post 1: Farhan Masud (Alumni - Brain Station 23)
        if farhan:
            p1 = FeedPost(
                author_id=farhan.id,
                content=(
                    "Exciting news for our DIU tech community! Our engineering group at Brain Station 23 is actively expanding. "
                    "We have 3 open positions for Junior & Associate Backend Engineers (Python / FastAPI / Docker / PostgreSQL).\n\n"
                    "Check the job listings on the CareerChain Jobs tab. If you have built projects with clean REST APIs or microservices, "
                    "message me directly through your profile for an internal referral!"
                ),
                post_type="SUCCESS_STORY",
                created_at=now - datetime.timedelta(hours=2)
            )
            posts.append((p1, [
                (tanvir, "Thank you for this great opportunity Farhan Bhai! Just applied via the CareerChain jobs board with my updated resume.", 1.8, [
                    (farhan, "Got your profile Tanvir! Your GitHub and Pytest coverage look great. Submitting your referral to HR today.", 1.2)
                ]),
                (sadia, "Is there an upcoming frontend or React role opening soon as well?", 1.5, [
                    (farhan, "Yes Sadia, our frontend team will open 2 React/TypeScript associate openings next Monday! Keep your profile ready.", 1.0)
                ])
            ], [
                (tanvir, "🎉"), (sadia, "👍"), (rakibul, "💪"), (mehedi, "❤️"), (mahmud, "👏"), (anika, "👍"), (admin, "🎉")
            ]))

        # Post 2: Admin - Prof. Dr. Syed Akhter Hossain
        if admin:
            p2 = FeedPost(
                author_id=admin.id,
                content=(
                    "Welcome to all DIU students and verified alumni on CareerChain!\n\n"
                    "This platform bridges our classrooms directly with industry mentors. Make sure to complete your profile with your technical skills, "
                    "GitHub repositories, and updated resume. Alumni mentors are actively reviewing student profiles for referrals and career guidance."
                ),
                post_type="UPDATE",
                created_at=now - datetime.timedelta(hours=6)
            )
            posts.append((p2, [
                (mehedi, "Thank you Sir! The alumni directory and mentorship messaging have already been immensely helpful for our machine learning research.", 5.2, []),
                (anika, "Proud to give back to DIU juniors. My mentorship availability is turned ON for all students needing QA & testing guidance.", 4.8, [])
            ], [
                (tanvir, "❤️"), (farhan, "👍"), (sadia, "👏"), (rakibul, "👍"), (mahmud, "❤️"), (hasan, "💡")
            ]))

        # Post 3: Tanvir Ahmed (Student)
        if tanvir and farhan:
            p3 = FeedPost(
                author_id=tanvir.id,
                content=(
                    "Alhamdulillah! Thrilled to share that I have officially cleared the final technical screening for the Associate Software Engineer role at Brain Station 23!\n\n"
                    "Huge gratitude to Farhan Masud bhai for mentoring me on system design, database indexing, and automated API testing. CareerChain made this connection possible!"
                ),
                post_type="SUCCESS_STORY",
                created_at=now - datetime.timedelta(hours=14)
            )
            posts.append((p3, [
                (farhan, "Well deserved Tanvir! Your preparation and technical foundation were exemplary. Welcome to the team!", 13.5, []),
                (rakibul, "Congratulations Tanvir! Inspiring achievement for our entire CSE batch.", 13.0, []),
                (sadia, "Huge congratulations Tanvir! Hard work always pays off!", 12.8, [])
            ], [
                (farhan, "🎉"), (admin, "👏"), (sadia, "❤️"), (rakibul, "🎉"), (mehedi, "💪"), (anika, "🎉")
            ]))

        # Post 4: Anika Tabassum (Alumni - Enosis)
        if anika:
            p4 = FeedPost(
                author_id=anika.id,
                content=(
                    "Interview Tip for DIU Software Engineers & QA aspirants:\n\n"
                    "Do not just list tools like Selenium, Playwright, or Postman on your resume. Build a real automated test repository on GitHub with clean assertions, "
                    "page-object models, and a GitHub Actions CI pipeline running tests on push.\n\n"
                    "Recruiters at top firms notice practical repositories immediately!"
                ),
                post_type="UPDATE",
                created_at=now - datetime.timedelta(hours=24)
            )
            posts.append((p4, [
                (sumaiya, "Thank you so much Apu! I just deployed my automated test harness with Playwright and Pytest on GitHub. Would love your feedback!", 22.0, [
                    (anika, "Send me the link on messages Sumaiya, will review it tonight!", 21.5)
                ])
            ], [
                (tanvir, "👍"), (sumaiya, "❤️"), (mahmud, "👏"), (tamim, "💡")
            ]))

        # Post 5: Mehedi Zaman (Student)
        if mehedi:
            p5 = FeedPost(
                author_id=mehedi.id,
                content=(
                    "Our team 'DIU NeuroTech' just clinched 1st Runner Up at the National AI & Machine Learning Hackathon 2026!\n\n"
                    "We developed a bilingual Bengali sentiment extraction and summarization engine using PyTorch, Hugging Face transformers, and FastAPI. 36 hours of non-stop innovation!"
                ),
                post_type="SUCCESS_STORY",
                created_at=now - datetime.timedelta(hours=36)
            )
            posts.append((p5, [
                (admin, "Outstanding achievement! The department is proud of you. Let us prepare this research for international publication.", 34.0, []),
                (hasan, "Impressive work on Bengali NLP Mehedi! Feel free to reach out if you want to test larger model inference pipelines.", 33.0, [])
            ], [
                (admin, "👏"), (tanvir, "🎉"), (sadia, "❤️"), (hasan, "💪")
            ]))

        # Post 6: Hasan Tariq (Alumni - Optimizely)
        if hasan:
            p6 = FeedPost(
                author_id=hasan.id,
                content=(
                    "Hosting an online technical session this Friday on 'Transitioning from University Projects to Enterprise Data Science & Machine Learning'.\n\n"
                    "We will cover real production data pipelines, automated feature stores, and A/B testing at scale. Registration is open on the Events tab!"
                ),
                post_type="UPDATE",
                created_at=now - datetime.timedelta(hours=48)
            )
            posts.append((p6, [
                (rakibul, "Registered! Really eager to learn about Optimizely experimentation architectures.", 46.0, [])
            ], [
                (rakibul, "👍"), (tanvir, "🎉"), (mahmud, "👏")
            ]))

        # Post 7: Sadia Islam (Student)
        if sadia:
            p7 = FeedPost(
                author_id=sadia.id,
                content=(
                    "Just launched the redesigned version of my personal developer portfolio with React 19, Tailwind CSS, and accessible UI patterns!\n\n"
                    "Check the live link on my profile. Would love constructive critiques from alumni frontend leads on web performance and Lighthouse scores!"
                ),
                post_type="UPDATE",
                created_at=now - datetime.timedelta(hours=60)
            )
            posts.append((p7, [
                (fariha, "Checked out your live portfolio Sadia! Excellent typography hierarchy and responsive layout. One pro tip: add focus-visible styles on interactive elements for keyboard accessibility.", 58.0, [
                    (sadia, "Thank you so much Fariha Apu! Implementing that right away.", 56.5)
                ])
            ], [
                (fariha, "❤️"), (tanvir, "👍"), (mehedi, "👏")
            ]))

        # Post 8: Tamim Iqbal (Alumni - TigerIT)
        if tamim:
            p8 = FeedPost(
                author_id=tamim.id,
                content=(
                    "DevOps Best Practice: Multi-Stage Docker Builds\n\n"
                    "When containerizing your FastAPI, Node, or Go services, use multi-stage builds to discard build toolchains from the final runtime image. "
                    "In our systems, this reduced Docker container size from 850 MB to 48 MB, drastically speeding up Kubernetes pod cold-starts!"
                ),
                post_type="UPDATE",
                created_at=now - datetime.timedelta(hours=72)
            )
            posts.append((p8, [
                (arifur, "This was a game changer for our automated GitHub Actions runner! Thank you Tamim Bhai for sharing.", 70.0, [])
            ], [
                (arifur, "💪"), (farhan, "👍"), (mahmud, "👏")
            ]))

        # Post 9: Zubair Alam (Alumni - Pathao)
        if zubair:
            p9 = FeedPost(
                author_id=zubair.id,
                content=(
                    "Pathao Engineering is hiring for Backend Engineer Interns!\n\n"
                    "If you love designing high-throughput APIs, distributed caching with Redis, and writing SQL queries that perform under heavy load, "
                    "check our listing on the CareerChain Jobs board! DIU graduates are always welcome."
                ),
                post_type="UPDATE",
                created_at=now - datetime.timedelta(hours=84)
            )
            posts.append((p9, [
                (tahmina, "Just submitted my application and resume. Looking forward to the interview process!", 82.0, [])
            ], [
                (tahmina, "🎉"), (tanvir, "👍"), (mahmud, "👏")
            ]))

        # Post 10: Ashikur Chowdhury (Student)
        if ashikur:
            p10 = FeedPost(
                author_id=ashikur.id,
                content=(
                    "Proud to announce that my mobile application 'DIU Campus Connect' is now live on Google Play! "
                    "Built using Flutter, Dart, and Firebase for real-time campus event updates. Reached 500+ active student downloads in the first 48 hours!"
                ),
                post_type="SUCCESS_STORY",
                created_at=now - datetime.timedelta(hours=96)
            )
            posts.append((p10, [
                (nafis, "Great execution Ashikur! Publishing and maintaining real apps with actual active users is the strongest proof of engineering competence you can show recruiters.", 94.0, [])
            ], [
                (nafis, "🎉"), (tanvir, "👏"), (sadia, "❤️")
            ]))

        # Save all posts, comments, replies, reactions
        for post_obj, comment_list, reaction_list in posts:
            db.add(post_obj)
            db.flush()

            for c_user, c_text, c_hours, r_list in comment_list:
                if not c_user:
                    continue
                comm = FeedComment(
                    post_id=post_obj.id,
                    author_id=c_user.id,
                    content=c_text,
                    created_at=now - datetime.timedelta(hours=c_hours)
                )
                db.add(comm)
                db.flush()

                for r_user, r_text, r_hours in r_list:
                    if not r_user:
                        continue
                    reply = FeedComment(
                        post_id=post_obj.id,
                        author_id=r_user.id,
                        parent_comment_id=comm.id,
                        content=r_text,
                        created_at=now - datetime.timedelta(hours=r_hours)
                    )
                    db.add(reply)

            for r_user, r_emoji in reaction_list:
                if not r_user:
                    continue
                db.add(FeedReaction(
                    post_id=post_obj.id,
                    user_id=r_user.id,
                    emoji=r_emoji
                ))

        db.commit()
        logger.info(f"Successfully seeded {len(posts)} Community Feed posts with comments and reactions!")

    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding feed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_feed()
