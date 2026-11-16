import datetime

from app.models.feed import FeedComment, FeedPost
from app.models.user import User
from app.routes.feed import _post_response


def test_feed_serializes_deleted_comment_without_author():
    created_at = datetime.datetime.utcnow()
    author = User(id=1, email="feed-author@example.com", full_name="Feed Author", role="ADMIN")
    deleted_comment = FeedComment(
        id=1,
        post_id=1,
        author_id=999,
        content="",
        is_deleted=True,
        created_at=created_at,
    )
    post = FeedPost(
        id=1,
        author_id=1,
        content="Feed post",
        post_type="UPDATE",
        created_at=created_at,
        author=author,
        comments=[deleted_comment],
        reactions=[],
    )

    response = _post_response(post, viewer_id=1)

    assert response.comments[0].is_deleted is True
    assert response.comments[0].author is None
