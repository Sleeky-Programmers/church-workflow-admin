export function mapMember(member: any) {
  const nameParts = member.fullName.split(" ");

  return {
    id: member._id,
    title: member.title || undefined,
    fullName: member.fullName,
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" "),
    email: member.email || "",
    phone: member.phoneNumber || "",
    gender: member.gender,
    birthday: member.birthday ? member.birthday.split("T")[0] : undefined,
    maritalStatus: member.maritalStatus,
    dateOfMarriage: member.dateOfMarriage
      ? member.dateOfMarriage.split("T")[0]
      : undefined,
    membershipStatus: member.membershipStatus,
    dateJoined: member.dateJoined ? member.dateJoined.split("T")[0] : undefined,
    baptized: member.isBaptized,
    volunteersPreference: member.volunteerPreferences,
    address: member.address || "",
    occupation: member.occupation || "",
    education: member.educationalBackground || "",
    ministriesInvolved: member.ministries || "",
    cellGroupName: member.cellGroupName || "",
    servicesAttended: member.servicesAttended || 0,
    servicesMissed: member.servicesMissed || 0,
    attendanceRate: member.attendanceRate || 0,
    attendanceRecords: member.attendanceRecords || [],
    initials:
      (nameParts[0]?.[0]?.toUpperCase() || "") +
      (nameParts[1]?.[0]?.toUpperCase() || ""),
  };
}
