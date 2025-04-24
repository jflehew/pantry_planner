from app import db


class GroceryList(db.Model):
    __tablename__= 'grocery_lists'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_purchased = db.Column(db.Boolean, default=False, nullable=False)

    user = db.relationship('User', backref='grocery_list')
    product = db.relationship('Product', backref='grocery_entries')


