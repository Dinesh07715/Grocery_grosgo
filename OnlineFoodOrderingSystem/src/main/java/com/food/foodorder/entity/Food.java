package com.food.foodorder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "foods")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(name = "image_url")
    private String imageUrl;

    private String description;



    
    @Column(nullable = false)
    private Double price;
    
    private String category;
//    private String imageUrl;
    
    private long stock;

    @Column(nullable = false)
private Boolean active = true;

@Column(nullable = false)
private String status = "AVAILABLE";


    public Food() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return  imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public void setStock(long stock) {
		this.stock = stock;
	}

	public Long getStock() { return stock; }
	
	

//	public String getImage() {
//		return image;
//	}
//
//	public void setImage(String image) {
//		this.image = image;
//	}


    public Boolean isActive() {
        return active;
    }
    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
