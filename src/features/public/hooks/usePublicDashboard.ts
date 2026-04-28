import type { PublicDashboardContext } from "../types/publicTypes.ts";

import {
    getFileDownloadUrl,
    getFileViewUrl,
} from "../utils/publicUtils.ts";

import { useActiveConference } from "./useActiveConference.ts";
import { useParticipantInvoice } from "./useParticipantInvoice.ts";
import { useParticipantProfile } from "./useParticipantProfile.ts";
import { useParticipantServices } from "./useParticipantServices.ts";
import { useParticipantSubmission } from "./useParticipantSubmission.ts";
import { usePublicAuth } from "./usePublicAuth.ts";

export function usePublicDashboard(): PublicDashboardContext {
    const currentUser = usePublicAuth();
    const activeConference = useActiveConference();

    const participantProfile = useParticipantProfile({
        currentUser,
        activeConference,
    });

    const {
        participantDraft,
        selectedConferenceEntry,
        selectedConferenceEntryId,
        conferenceEntryOptions,
        applyParticipantState,
    } = participantProfile;

    const participantSubmission = useParticipantSubmission({
        currentUser,
        participantDraft,
        applyParticipantState,
    });

    const participantServices = useParticipantServices({
        activeConference,
        selectedConferenceEntry,
    });

    const participantInvoice = useParticipantInvoice({
        participantDraft,
        selectedAccommodation: participantServices.selectedAccommodation,
        catering: participantServices.catering,
        cateringOptions: participantServices.cateringOptions,
    });

    return {
        currentUser,
        activeConference,

        participantDraft,
        selectedConferenceEntryId,
        selectedConferenceEntry,
        conferenceEntryOptions,

        isStudent: participantProfile.isStudent,
        isStudentStatusLocked: participantProfile.isStudentStatusLocked,
        studentProofFile: participantProfile.studentProofFile,
        studentVerificationFile: participantProfile.studentVerificationFile,
        studentVerificationFileName:
        participantProfile.studentVerificationFileName,
        studentVerificationStatus:
        participantProfile.studentVerificationStatus,
        savedIsStudent: participantProfile.savedIsStudent,
        savingParticipant: participantProfile.savingParticipant,
        uploadingStudentProof: participantProfile.uploadingStudentProof,
        saveParticipantError: participantProfile.saveParticipantError,
        studentUploadError: participantProfile.studentUploadError,
        hasParticipationChanges: participantProfile.hasParticipationChanges,

        willPresent: participantSubmission.willPresent,
        presentationFile: participantSubmission.presentationFile,
        submissionRecord: participantSubmission.submissionRecord,
        submission: participantSubmission.submission,
        submissionLoading: participantSubmission.submissionLoading,
        savingSubmission: participantSubmission.savingSubmission,
        uploadingPresentation: participantSubmission.uploadingPresentation,
        saveSubmissionError: participantSubmission.saveSubmissionError,
        submissionFieldErrors: participantSubmission.submissionFieldErrors,
        submissionSuccessMessage: participantSubmission.submissionSuccessMessage,

        latestSubmissionFile: participantSubmission.latestSubmissionFile,
        latestSubmissionFileName: participantSubmission.latestSubmissionFileName,
        latestSubmissionFileStatus:
        participantSubmission.latestSubmissionFileStatus,
        isSubmissionStatusLocked:
        participantSubmission.isSubmissionStatusLocked,

        accommodation: participantServices.accommodation,
        accommodationOptions: participantServices.accommodationOptions,
        selectedAccommodation: participantServices.selectedAccommodation,
        catering: participantServices.catering,
        cateringOptions: participantServices.cateringOptions,

        invoiceGenerated: participantInvoice.invoiceGenerated,
        invoiceStatus: participantInvoice.invoiceStatus,
        invoiceType: participantInvoice.invoiceType,
        sharedInvoiceCode: participantInvoice.sharedInvoiceCode,
        joinCode: participantInvoice.joinCode,
        hasCustomBilling: participantInvoice.hasCustomBilling,
        billingInfo: participantInvoice.billingInfo,
        invoice: participantInvoice.invoice,
        invoiceLoading: participantInvoice.invoiceLoading,
        invoiceError: participantInvoice.invoiceError,
        supplier: participantInvoice.supplier,
        supplierLoading: participantInvoice.supplierLoading,

        summary: {
            conferenceEntryLabel: participantProfile.conferenceEntryLabel,
            studentStatusLabel: participantProfile.studentStatusLabel,
            submissionStatusLabel: participantSubmission.submissionStatusLabel,
        },

        total: participantServices.total,

        setSelectedConferenceEntryId:
        participantProfile.setSelectedConferenceEntryId,
        setIsStudent: participantProfile.setIsStudent,
        setStudentProofFile: participantProfile.setStudentProofFile,

        setWillPresent: participantSubmission.setWillPresent,
        setPresentationFile: participantSubmission.setPresentationFile,
        setSubmission: participantSubmission.setSubmission,

        setAccommodation: participantServices.setAccommodation,
        setCatering: participantServices.setCatering,

        setInvoiceType: participantInvoice.setInvoiceType,
        setJoinCode: participantInvoice.setJoinCode,
        setHasCustomBilling: participantInvoice.setHasCustomBilling,
        setBillingInfo: participantInvoice.setBillingInfo,

        handleSaveParticipation: participantProfile.handleSaveParticipation,
        handleUploadStudentProof: participantProfile.handleUploadStudentProof,

        handleSaveSubmission: participantSubmission.handleSaveSubmission,
        handleUploadSubmissionFile:
        participantSubmission.handleUploadSubmissionFile,

        handleGenerateInvoice: participantInvoice.handleGenerateInvoice,
        handleDownloadInvoice: participantInvoice.handleDownloadInvoice,
        copySharedInvoiceCode: participantInvoice.copySharedInvoiceCode,

        getFileViewUrl,
        getFileDownloadUrl,
    };
}