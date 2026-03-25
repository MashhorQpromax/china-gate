// ============================================================================
// ENUMS - Basic Data Types
// ============================================================================

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EXECUTIVE = 'EXECUTIVE',
  EMPLOYEE = 'EMPLOYEE',
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  MANUFACTURER = 'MANUFACTURER',
  CUSTOMS_AGENT = 'CUSTOMS_AGENT',
  LOGISTICS_PARTNER = 'LOGISTICS_PARTNER',
  BANK_REPRESENTATIVE = 'BANK_REPRESENTATIVE',
}

export enum CompanyRole {
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  LOGISTICS_PROVIDER = 'LOGISTICS_PROVIDER',
  CUSTOMS_AGENT = 'CUSTOMS_AGENT',
  BANK = 'BANK',
}

export enum AccountType {
  INDIVIDUAL = 'INDIVIDUAL',
  ENTERPRISE = 'ENTERPRISE',
  PREMIUM = 'PREMIUM',
  TRIAL = 'TRIAL',
}

export enum DealStage {
  NEGOTIATION = 'NEGOTIATION',
  QUOTATION_SENT = 'QUOTATION_SENT',
  QUOTATION_REVIEW = 'QUOTATION_REVIEW',
  QUOTATION_ACCEPTED = 'QUOTATION_ACCEPTED',
  PO_ISSUED = 'PO_ISSUED',
  PO_CONFIRMED = 'PO_CONFIRMED',
  PRODUCTION_START = 'PRODUCTION_START',
  PRODUCTION_INSPECTION = 'PRODUCTION_INSPECTION',
  READY_FOR_SHIPMENT = 'READY_FOR_SHIPMENT',
  LC_ISSUED = 'LC_ISSUED',
  GOODS_SHIPPED = 'GOODS_SHIPPED',
  GOODS_IN_TRANSIT = 'GOODS_IN_TRANSIT',
  PORT_ARRIVED = 'PORT_ARRIVED',
  CUSTOMS_CLEARANCE = 'CUSTOMS_CLEARANCE',
  DELIVERY = 'DELIVERY',
  COMPLETED = 'COMPLETED',
}

export enum LCStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  BANK_RECEIVED = 'BANK_RECEIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  ISSUED = 'ISSUED',
  AMENDMENT_REQUESTED = 'AMENDMENT_REQUESTED',
  AMENDED = 'AMENDED',
  NEGOTIATION = 'NEGOTIATION',
  ACCEPTED = 'ACCEPTED',
  PAYMENT_MADE = 'PAYMENT_MADE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum LGStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  BANK_REVIEW = 'BANK_REVIEW',
  APPROVED = 'APPROVED',
  ISSUED = 'ISSUED',
  CLAIMED = 'CLAIMED',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum LCType {
  IRREVOCABLE = 'IRREVOCABLE',
  REVOCABLE = 'REVOCABLE',
  STANDBY = 'STANDBY',
  REVOLVING = 'REVOLVING',
  BACK_TO_BACK = 'BACK_TO_BACK',
  TRANSFERABLE = 'TRANSFERABLE',
}

export enum LGType {
  BID_BOND = 'BID_BOND',
  PERFORMANCE_BOND = 'PERFORMANCE_BOND',
  ADVANCE_PAYMENT_GUARANTEE = 'ADVANCE_PAYMENT_GUARANTEE',
  CUSTOMS_GUARANTEE = 'CUSTOMS_GUARANTEE',
  RETENTION_GUARANTEE = 'RETENTION_GUARANTEE',
}

export enum PaymentTerms {
  ADVANCE = 'ADVANCE',
  ADVANCE_DEPOSIT = 'ADVANCE_DEPOSIT',
  AFTER_INSPECTION = 'AFTER_INSPECTION',
  COD = 'COD',
  NET_30 = 'NET_30',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  LC = 'LC',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  PACKED = 'PACKED',
  IN_WAREHOUSE = 'IN_WAREHOUSE',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  PORT_ARRIVED = 'PORT_ARRIVED',
  CUSTOMS_CLEARANCE = 'CUSTOMS_CLEARANCE',
  FINAL_DELIVERY = 'FINAL_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  DAMAGED = 'DAMAGED',
}

export enum ShipmentType {
  AIR = 'AIR',
  SEA = 'SEA',
  LAND = 'LAND',
  MULTIMODAL = 'MULTIMODAL',
}

export enum QualityStage {
  PRE_PRODUCTION = 'PRE_PRODUCTION',
  MATERIAL_CHECK = 'MATERIAL_CHECK',
  FIRST_ARTICLE_INSPECTION = 'FIRST_ARTICLE_INSPECTION',
  PRODUCTION_PROCESS = 'PRODUCTION_PROCESS',
  IN_PROCESS_INSPECTION = 'IN_PROCESS_INSPECTION',
  FINAL_INSPECTION = 'FINAL_INSPECTION',
  PACKAGING_INSPECTION = 'PACKAGING_INSPECTION',
  LOAD_CHECK = 'LOAD_CHECK',
  TRANSIT_MONITORING = 'TRANSIT_MONITORING',
  POST_DELIVERY_VERIFICATION = 'POST_DELIVERY_VERIFICATION',
}

export enum InspectionResult {
  PASS = 'PASS',
  CONDITIONAL_PASS = 'CONDITIONAL_PASS',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
}

export enum WorkflowStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
}

export enum WorkflowAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  REQUEST_REVISION = 'REQUEST_REVISION',
  HOLD = 'HOLD',
  RESUME = 'RESUME',
  COMPLETE = 'COMPLETE',
}

export enum PartnershipStatus {
  INQUIRY = 'INQUIRY',
  UNDER_DISCUSSION = 'UNDER_DISCUSSION',
  AGREEMENT_SENT = 'AGREEMENT_SENT',
  AGREEMENT_SIGNED = 'AGREEMENT_SIGNED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export enum TrainingDirection {
  MANUFACTURING_TECHNIQUES = 'MANUFACTURING_TECHNIQUES',
  QUALITY_CONTROL = 'QUALITY_CONTROL',
  SAFETY_STANDARDS = 'SAFETY_STANDARDS',
  ENVIRONMENTAL_COMPLIANCE = 'ENVIRONMENTAL_COMPLIANCE',
  LABOR_PRACTICES = 'LABOR_PRACTICES',
  TECHNOLOGY_TRANSFER = 'TECHNOLOGY_TRANSFER',
}

export enum DisputeResolution {
  NEGOTIATION = 'NEGOTIATION',
  MEDIATION = 'MEDIATION',
  ARBITRATION = 'ARBITRATION',
  LITIGATION = 'LITIGATION',
}

export enum Incoterm {
  FOB = 'FOB',
  CIF = 'CIF',
  CFR = 'CFR',
  EXW = 'EXW',
  DDP = 'DDP',
  FCA = 'FCA',
  CPT = 'CPT',
  CIP = 'CIP',
  DAP = 'DAP',
  DAT = 'DAT',
}

export enum Currency {
  USD = 'USD',
  CNY = 'CNY',
  SAR = 'SAR',
  AED = 'AED',
  KWD = 'KWD',
  QAR = 'QAR',
  BHD = 'BHD',
  OMR = 'OMR',
}

export enum Country {
  CHINA = 'CHINA',
  SAUDI_ARABIA = 'SAUDI_ARABIA',
  UAE = 'UAE',
  KUWAIT = 'KUWAIT',
  QATAR = 'QATAR',
  BAHRAIN = 'BAHRAIN',
  OMAN = 'OMAN',
}

export enum NotificationType {
  DEAL_UPDATE = 'DEAL_UPDATE',
  LC_ISSUED = 'LC_ISSUED',
  SHIPMENT_ALERT = 'SHIPMENT_ALERT',
  QUALITY_REPORT = 'QUALITY_REPORT',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
  WORKFLOW_ACTION = 'WORKFLOW_ACTION',
  CUSTOMS_CLEARANCE = 'CUSTOMS_CLEARANCE',
  PARTNERSHIP_UPDATE = 'PARTNERSHIP_UPDATE',
}

// ============================================================================
// INTERFACES - Complex Data Structures
// ============================================================================

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  companyId: string;
  department?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  nameEn: string;
  nameAr: string;
  companyRole: CompanyRole;
  accountType: AccountType;
  registrationNumber: string;
  taxId?: string;
  website?: string;
  email: string;
  phone: string;
  address: string;
  country: Country;
  city: string;
  sector: string;
  employees: number;
  description?: string;
  logo?: string;
  certifications: string[];
  bankDetails?: BankDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban?: string;
  swift: string;
  currency: Currency;
}

export interface BuyerProfile {
  id: string;
  companyId: string;
  industry: string;
  annualBudget: number;
  purchasingCapacity: number;
  preferredTerms: PaymentTerms[];
  tradingHistory: number;
  certifications: string[];
  rating: number;
  reviewCount: number;
}

export interface SupplierProfile {
  id: string;
  companyId: string;
  minOrderQuantity: number;
  leadTime: number; // days
  productCategories: string[];
  certifications: string[];
  qualityRating: number;
  deliveryRating: number;
  communicationRating: number;
  totalOrders: number;
  successRate: number;
  exportExperience: number; // years
}

export interface ManufacturerProfile {
  id: string;
  companyId: string;
  factorySize: string;
  employees: number;
  productionCapacity: number;
  leadTime: number; // days
  certifications: string[];
  specializations: string[];
  laborCompliance: boolean;
  environmentalCertification: boolean;
  qualityManagement: string; // ISO standard
  customCapability: boolean;
}

export interface Product {
  id: string;
  supplierId: string;
  nameEn: string;
  nameAr: string;
  sku: string;
  categoryEn: string;
  categoryAr: string;
  description: string;
  specification: string;
  unitPrice: number;
  currency: Currency;
  minOrderQuantity: number;
  packagingType: string;
  unitOfMeasure: string;
  leadTime: number;
  moq: number;
  images: string[];
  certifications: string[];
  weight?: number;
  dimensions?: string;
  hsCode?: string;
  createdAt: Date;
}

export interface PurchaseRequest {
  id: string;
  referenceNumber: string;
  buyerId: string;
  productId: string;
  quantity: number;
  unitOfMeasure: string;
  requiredDeliveryDate: Date;
  budget: number;
  currency: Currency;
  specifications?: string;
  status: WorkflowStatus;
  quotations: string[]; // Quotation IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Quotation {
  id: string;
  referenceNumber: string;
  purchaseRequestId: string;
  supplierId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: Currency;
  totalPrice: number;
  incoterm: Incoterm;
  paymentTerms: PaymentTerms;
  leadTime: number; // days
  validUntil: Date;
  notes?: string;
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  referenceNumber: string;
  buyerId: string;
  supplierId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  currency: Currency;
  incoterm: Incoterm;
  paymentTerms: PaymentTerms;
  stage: DealStage;
  expectedDeliveryDate: Date;
  shippingPort: string;
  destinationPort: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LC {
  id: string;
  referenceNumber: string;
  dealId: string;
  buyerId: string;
  supplierId: string;
  bankId: string;
  type: LCType;
  amount: number;
  currency: Currency;
  issueDate: Date;
  expiryDate: Date;
  shipmentsRequired: number;
  description: string;
  documentsRequired: string[];
  beneficiaryBank?: string;
  status: LCStatus;
  amountUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LG {
  id: string;
  referenceNumber: string;
  dealId: string;
  requesterId: string;
  bankId: string;
  type: LGType;
  amount: number;
  currency: Currency;
  issueDate: Date;
  expiryDate: Date;
  claimCondition: string;
  beneficiary: string;
  status: LGStatus;
  amountClaimed?: number;
  claimDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  referenceNumber: string;
  dealId: string;
  supplierId: string;
  buyerId: string;
  type: ShipmentType;
  carrierId: string;
  carrierName: string;
  originPort: string;
  destinationPort: string;
  departureDate: Date;
  expectedArrivalDate: Date;
  actualArrivalDate?: Date;
  status: ShipmentStatus;
  containerNumber?: string;
  blNumber?: string;
  packagesCount: number;
  totalWeight: number;
  totalVolume: number;
  insurance: boolean;
  insuranceValue?: number;
  insuranceProvider?: string;
  trackingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QualityInspection {
  id: string;
  stageId: string;
  stage: QualityStage;
  dealId: string;
  inspectorId: string;
  result: InspectionResult;
  defectRate: number;
  notes: string;
  photos: string[];
  certifications: string[];
  completedAt: Date;
}

export interface QualityJourney {
  id: string;
  dealId: string;
  startDate: Date;
  endDate?: Date;
  status: WorkflowStatus;
  stages: QualityInspection[];
  overallResult: InspectionResult;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Partnership {
  id: string;
  referenceNumber: string;
  initiatorId: string;
  partnerId: string;
  status: PartnershipStatus;
  partnershipType: 'MANUFACTURING' | 'LABOR_LENDING' | 'DISTRIBUTION';
  description: string;
  terms: string;
  trainingDirections?: TrainingDirection[];
  agreementDocument?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityId?: string;
  read: boolean;
  createdAt: Date;
}

export interface CustomsClearance {
  id: string;
  referenceNumber: string;
  shipmentId: string;
  importerId: string;
  customsAgentId?: string;
  importCountry: Country;
  hsCode: string;
  declaredValue: number;
  currency: Currency;
  dutyRate: number;
  estimatedDuty: number;
  estimatedVAT?: number;
  status: WorkflowStatus;
  documentsSubmitted: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowApproval {
  id: string;
  entityType: 'DEAL' | 'LC' | 'QUOTATION' | 'PARTNERSHIP';
  entityId: string;
  approverIds: string[];
  currentApproverId: string;
  status: WorkflowStatus;
  action: WorkflowAction;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  dealId?: string;
  lastMessage?: Message;
  lastActivityAt: Date;
  createdAt: Date;
}

export interface Dispute {
  id: string;
  referenceNumber: string;
  dealId: string;
  raisedById: string;
  description: string;
  status: WorkflowStatus;
  resolutionMethod: DisputeResolution;
  desiredOutcome: string;
  documents: string[];
  resolution?: string;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  entityType: 'SUPPLIER' | 'BUYER' | 'MANUFACTURER';
  entityId: string;
  reviewerId: string;
  dealId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  entityType: string;
  entityId: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  timestamp: Date;
}
