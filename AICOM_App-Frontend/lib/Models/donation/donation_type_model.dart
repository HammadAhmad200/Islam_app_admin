class DonationType {
  final String id;
  final String title;
  final String category; // regular, zakat, emergency
  final double amount;
  final String description;
  final bool isActive;

  DonationType({
    required this.id,
    required this.title,
    required this.category,
    required this.amount,
    required this.description,
    required this.isActive,
  });

  factory DonationType.fromJson(Map<String, dynamic> json) {
    return DonationType(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? 'regular',
      amount: (json['amount'] ?? 0).toDouble(),
      description: json['description'] ?? '',
      isActive: json['isActive'] ?? true,
    );
  }
}
