from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from database import get_db
from models import ActionItem, Meeting
from schemas import (
    ActionItemCreate,
    ActionItemResponse,
    ActionItemUpdate,
)


router = APIRouter(
    prefix="/api/action-items",
    tags=["Action Items"],
)


@router.get(
    "/meeting/{meeting_id}",
    response_model=list[ActionItemResponse],
)
def get_action_items(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    items = (
        db.query(ActionItem)
        .options(
            selectinload(ActionItem.assignee)
        )
        .filter(
            ActionItem.meeting_id == meeting_id
        )
        .order_by(ActionItem.created_at.desc())
        .all()
    )

    return items


@router.post(
    "/meeting/{meeting_id}",
    response_model=ActionItemResponse,
    status_code=201,
)
def create_action_item(
    meeting_id: int,
    item_data: ActionItemCreate,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

    item = ActionItem(
        meeting_id=meeting_id,
        title=item_data.title,
        description=item_data.description,
        assignee_id=item_data.assignee_id,
        due_date=item_data.due_date,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.patch(
    "/{item_id}",
    response_model=ActionItemResponse,
)
def update_action_item(
    item_id: int,
    item_data: ActionItemUpdate,
    db: Session = Depends(get_db),
):
    item = (
        db.query(ActionItem)
        .filter(ActionItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Action item not found",
        )

    update_data = item_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@router.delete(
    "/{item_id}",
    status_code=204,
)
def delete_action_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    item = (
        db.query(ActionItem)
        .filter(ActionItem.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Action item not found",
        )

    db.delete(item)
    db.commit()

    return None