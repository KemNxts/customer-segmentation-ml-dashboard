def generate_recommendations(segment: str, will_purchase_next_30: int):
    """
    Generates business recommendations based on segment and prediction.
    """
    offers = []
    strategy = ""
    upsell = ""
    
    if segment == 'High Value':
        strategy = "VIP Retention & Upsell"
        if will_purchase_next_30:
            offers.append("Early access to new products")
            upsell = "Premium subscription / High-ticket items"
        else:
            offers.append("Exclusive 'We Miss You' VIP gift")
            upsell = "Personalized bundled products"
            
    elif segment == 'Low Engagement':
        strategy = "Re-engagement"
        if will_purchase_next_30:
            offers.append("Limited time 10% discount on next purchase")
            upsell = "Popular/Trending low-risk items"
        else:
            offers.append("Aggressive 20% discount or free shipping")
            upsell = "Clearance / Entry-level items"
            
    else: # At Risk
        strategy = "Churn Prevention"
        if will_purchase_next_30:
            offers.append("Loyalty points multiplier on next purchase")
            upsell = "Frequently bought together items"
        else:
            offers.append("Reactivation bonus: 30% off your entire cart")
            upsell = "Best sellers for reliable experience"
            
    return {
        "strategy": strategy,
        "offers": offers,
        "upsell_cross_sell": upsell
    }
