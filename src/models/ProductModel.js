export default class ProductModel {
    constructor (id, name, description, price, quantity, categoryId, subcategoryId, sizeId, image) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.quantity = quantity
        this.categoryId = categoryId
        this.subcategoryId = subcategoryId
        this.sizeId = sizeId
        this.image = image
    }
}