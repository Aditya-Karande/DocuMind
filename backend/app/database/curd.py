from .models import Chat,Message,Document,User

#create chat
def create_chat(db, title, path,user_id):
    new_chat = Chat(
        title=title,
        vector_store_path = path,
        user_id = user_id
    )

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return new_chat

#get single chat
def get_chat(db, chat_id):
    return db.query(Chat).filter(
        Chat.id == chat_id
    ).first()

#get all chats
def get_all_chats(db,user_id):
    return db.query(Chat).filter(Chat.user_id == user_id).all()

#delete chat
def delete_chat(db,chat_id):

    # delete messages first
    db.query(Message).filter(Message.chat_id == chat_id).delete()
    
    # delete documents second
    db.query(Document).filter(Document.chat_id == chat_id).delete()

    #then chat
    chat = db.query(Chat).filter(
        Chat.id == chat_id
    ).first()

    if not chat:
        return None
    
    db.delete(chat)
    db.commit()

    return chat

#update chat name
def update_chat_name(db, chat_id, new_title):
    chat = db.query(Chat).filter(
        Chat.id == chat_id
    ).first()

    if not chat:
        return None
    
    chat.title = new_title

    db.commit()
    db.refresh(chat)
    
    return chat

#create messages
def create_message(db,chat_id,role,content):
    message = Message(
        chat_id = chat_id,
        role = role,
        content = content
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message

#get messages
def get_chat_messages(db,chat_id):
    return db.query(Message).filter(
        Message.chat_id == chat_id
    ).order_by(Message.id.asc()).all()

#recent messages
def get_recent_messages(db,chat_id,limit=6):
    return (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.id.desc())
        .limit(limit)
        .all()
    )

#create document
def create_document(db, chat_id, filename, filepath):
    doc = Document(
        chat_id = chat_id,
        file_name = filename,
        file_path = filepath,

    )

    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    return doc

#get documents
def get_document(db,chat_id):
    return (
        db.query(Document)
        .filter(Document.chat_id == chat_id)
        .all()
        )

#get one document
def get_one_document(db, doc_id):
    return (
        db.query(Document)
        .filter(Document.id == doc_id)
        .first()
    )

#delete document
def delete_document(db,document):
    
    db.delete(document)
    db.commit()

#user create
def create_user(db,username,email,password):


    new_user = User(
        username=username,
        email=email,
        password=password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

#delete user
def delete_user(db,user_id):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        return None
    
    db.delete(user)
    db.commit()
    return user

#get all users
def get_all_users(db):
    return db.query(User).all() 

#get 1 user
def get_user(db, user_id):
    return db.query(User).filter(
        User.id == user_id
    ).first()