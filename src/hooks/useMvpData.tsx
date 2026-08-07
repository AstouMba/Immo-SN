import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inquiriesApi, propertiesApi, reservationsApi, visitsApi, type InquiryStatus, type PropertyWritePayload, type RequestStatus } from "@/lib/api";

export const useMvpProperties = (filters?: Parameters<typeof propertiesApi.list>[0], includeAll = false) => {
  return useQuery({
    queryKey: ["mvp-properties", filters, includeAll],
    queryFn: () => propertiesApi.list(filters, includeAll),
  });
};

export const useMvpProperty = (id: string | undefined) => {
  return useQuery({
    queryKey: ["mvp-property", id],
    queryFn: () => propertiesApi.getOne(id as string),
    enabled: Boolean(id),
  });
};

export const useAdminData = () => {
  const queryClient = useQueryClient();
  const properties = useMvpProperties(undefined, true);
  const inquiries = useQuery({ queryKey: ["admin-inquiries"], queryFn: inquiriesApi.list });
  const visits = useQuery({ queryKey: ["admin-visits"], queryFn: visitsApi.list });
  const reservations = useQuery({ queryKey: ["admin-reservations"], queryFn: reservationsApi.list });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["mvp-properties"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-visits"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
  };

  const createProperty = useMutation({ mutationFn: (payload: PropertyWritePayload) => propertiesApi.create(payload), onSuccess: refresh });
  const updateProperty = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<PropertyWritePayload> }) => propertiesApi.update(id, payload), onSuccess: refresh });
  const deleteProperty = useMutation({ mutationFn: propertiesApi.remove, onSuccess: refresh });
  const updateInquiry = useMutation({ mutationFn: ({ id, status }: { id: string; status: InquiryStatus }) => inquiriesApi.updateStatus(id, status), onSuccess: refresh });
  const updateVisit = useMutation({ mutationFn: ({ id, status }: { id: string; status: RequestStatus }) => visitsApi.updateStatus(id, status), onSuccess: refresh });
  const updateReservation = useMutation({ mutationFn: ({ id, status }: { id: string; status: RequestStatus }) => reservationsApi.updateStatus(id, status), onSuccess: refresh });

  return { properties, inquiries, visits, reservations, createProperty, updateProperty, deleteProperty, updateInquiry, updateVisit, updateReservation };
};
