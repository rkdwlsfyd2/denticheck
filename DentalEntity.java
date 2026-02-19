// resolved content of DentalEntity.java

// Assuming both HEAD and origin/feature/api-service definitions contain methods and properties.

public class DentalEntity {

    private String id;
    private String name;
    private String type;

    // Constructor
    public DentalEntity(String id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    // Special methods as needed
}