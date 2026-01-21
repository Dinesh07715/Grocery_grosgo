package com.food.foodorder.dto;

public class CartRequest {

    private Long foodId;
    private Integer quantity;

   

    

	public Long getFoodId() {
		return foodId;
	}

	public void setFoodId(Long foodId) {
		this.foodId = foodId;
	}

	public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
