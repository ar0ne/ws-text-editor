"use client";

import { useEffect, useState } from "react";

import { userIdentityService } from "../services/mock-user-service";


export function useUserId() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(userIdentityService.getUserId());
  }, []);

  return userId;
}